using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.SignalR;

namespace FrcsPos.Socket
{
    public class PosHub : Hub
    {
        // Track which connections are scanners and their terminal groups
        private static ConcurrentDictionary<string, string> _scannerConnections = new();

        public async Task SendScan(ScannerDTO scanDto)
        {
            var terminalId = scanDto.QuickConnectId;
            var barcode = scanDto.Barcode;
            Console.WriteLine($"📱 Scanner sending barcode {barcode} to terminal {terminalId}");

            // Send to the terminal's group
            await Clients.Group(terminalId).SendAsync("ReceiveScan", barcode);
        }

        public async Task JoinTerminal(string terminalId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, terminalId);
            Console.WriteLine($"🖥️ Terminal {terminalId} joined (ConnectionId: {Context.ConnectionId})");
            await Clients.Caller.SendAsync("ReceivedJoinTerminal", $"✅ Terminal {terminalId} joined successfully");
        }

        public async Task JoinScanner(string terminalId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, terminalId);

            // Track this connection as a scanner for this terminal
            _scannerConnections[Context.ConnectionId] = terminalId;

            Console.WriteLine($"📱 Scanner joined terminal {terminalId} (ConnectionId: {Context.ConnectionId})");

            // Confirm to the scanner
            await Clients.Caller.SendAsync("ReceivedJoinScanner", $"✅ Scanner joined terminal {terminalId}");

            // Notify the terminal (not the scanner itself)
            Console.WriteLine($"🔔 Notifying terminal {terminalId} about scanner connection");
            await Clients.OthersInGroup(terminalId).SendAsync(
                "ScannerConnected",
                $"📱 A scanner joined terminal {terminalId}"
            );

            Console.WriteLine($"✅ Scanner join complete for terminal {terminalId}");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"🔌 Connection {Context.ConnectionId} disconnected.");

            // Check if this was a scanner connection
            if (_scannerConnections.TryRemove(Context.ConnectionId, out var terminalId))
            {
                Console.WriteLine($"📱 Scanner disconnected from terminal {terminalId}");

                // Only notify the specific terminal group that their scanner disconnected
                await Clients.Group(terminalId).SendAsync(
                    "ScannerDisconnected",
                    $"Scanner disconnected from terminal {terminalId}"
                );
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}