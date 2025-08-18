using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Controllers
{
    [ApiController]
    [Route("ws")]
    public class WebSocketController : BaseController
    {
        private readonly IInventoryRepository _inventoryRepository;
        
        public WebSocketController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<WebSocketController> logger,
            IInventoryRepository inventoryRepository) : base(configuration, tokenService, logger)
        {
            _inventoryRepository = inventoryRepository;
        }

        [HttpGet("connect")]
        public async Task Connect()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                Console.WriteLine("WebSocket connection established");

                await HandleConnection(webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = 400;
            }
        }

        private async Task HandleConnection(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine("WebSocket connection closed");
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                }
                else
                {
                    var messageJson = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"Received: {messageJson}");

                    try
                    {
                        var message = JsonSerializer.Deserialize<WebSocketDTO>(messageJson);
                        if (message != null)
                        {
                            Console.WriteLine($"[Type: {message.Type}] Payload: {message.Payload}");

                            // Process the message based on its type
                            string responseJson = "";
                            
                            switch (message.Type)
                            {
                                case WebSocketType.SCAN:
                                    responseJson = await ProcessBarcodeScan(message);
                                    break;
                                    
                                case WebSocketType.PING:
                                    // Just echo back the payload for PING messages
                                    responseJson = JsonSerializer.Serialize(new { 
                                        type = "PING", 
                                        payload = message.Payload,
                                        sessionId = message.SessionId
                                    });
                                    break;
                                    
                                default:
                                    // Unknown message type
                                    responseJson = JsonSerializer.Serialize(new { 
                                        type = "ERROR", 
                                        payload = "Unknown message type",
                                        sessionId = message.SessionId
                                    });
                                    break;
                            }
                            
                            // Send the response back to the client
                            var responseBytes = Encoding.UTF8.GetBytes(responseJson);
                            await webSocket.SendAsync(
                                new ArraySegment<byte>(responseBytes, 0, responseBytes.Length),
                                WebSocketMessageType.Text,
                                true,
                                CancellationToken.None
                            );
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to process message: {ex.Message}");
                        
                        // Send error response
                        var errorJson = JsonSerializer.Serialize(new { 
                            type = "ERROR", 
                            payload = $"Error processing message: {ex.Message}"
                        });
                        var errorBytes = Encoding.UTF8.GetBytes(errorJson);
                        await webSocket.SendAsync(
                            new ArraySegment<byte>(errorBytes, 0, errorBytes.Length),
                            WebSocketMessageType.Text,
                            true,
                            CancellationToken.None
                        );
                    }
                }
            }
        }
        
        private async Task<string> ProcessBarcodeScan(WebSocketDTO message)
        {
            if (string.IsNullOrEmpty(message.Payload))
            {
                return JsonSerializer.Serialize(new { 
                    type = "ERROR", 
                    payload = "Barcode payload is empty",
                    sessionId = message.SessionId
                });
            }
            
            // Extract session ID and barcode from the message
            string barcode = message.Payload;
            string sessionId = message.SessionId ?? "";
            
            try
            {
                // Get the company ID from the session
                // For now, we'll use a default company ID of 1
                // In a real implementation, you would get this from the session
                int companyId = 1;
                
                // Find the product by barcode
                var productResponse = await _inventoryRepository.GetProductByBarcodeAsync(companyId, barcode);
                
                if (productResponse.Success)
                {
                    // Product found, return it
                    return JsonSerializer.Serialize(new { 
                        type = "SCAN_RESULT", 
                        payload = productResponse.Data,
                        sessionId = sessionId,
                        success = true
                    });
                }
                else
                {
                    // Product not found
                    return JsonSerializer.Serialize(new { 
                        type = "SCAN_RESULT", 
                        payload = productResponse.Message,
                        sessionId = sessionId,
                        success = false
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing barcode scan: {ex.Message}");
                return JsonSerializer.Serialize(new { 
                    type = "ERROR", 
                    payload = $"Error processing barcode scan: {ex.Message}",
                    sessionId = sessionId
                });
            }
        }
    }
}