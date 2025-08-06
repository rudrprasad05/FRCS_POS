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

namespace FrcsPos.Controllers
{
    [ApiController]
    [Route("ws")]
    public class WebSocketController : BaseController
    {
        public WebSocketController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<WebSocketController> logger) : base(configuration, tokenService, logger)
        {
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

                            // Echo it back (optional)
                            var echo = Encoding.UTF8.GetBytes("Echo: " + message.Payload);
                            await webSocket.SendAsync(
                                new ArraySegment<byte>(echo, 0, echo.Length),
                                WebSocketMessageType.Text,
                                true,
                                CancellationToken.None
                            );
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to parse message: {ex.Message}");
                    }
                }
            }
        }
    }
}