using System;
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
        private readonly IQuickConnectRepository _quickConnectRepo;

        public PosHub(IQuickConnectRepository quickConnectRepo)
        {
            _quickConnectRepo = quickConnectRepo;
        }
        public async Task SendScan(string terminalId, string sku)
        {
            await Clients.Group(terminalId).SendAsync("ReceiveScan", sku);
        }

        // POS terminal joins its group
        public async Task JoinTerminal(string terminalId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, terminalId);
            Console.WriteLine("connected from terminal " + Context.ConnectionId + " " + terminalId);
            await Clients.Caller.SendAsync("ReceivedJoinTerminal", $"✅ Terminal {terminalId} joined successfully");
        }

        // Scanner joins the same group
        public async Task JoinScanner(string qcUUID)
        {
            var posSession = await _quickConnectRepo.GetPosSession(qcUUID);
            if (posSession == null || posSession.Data == null)
            {
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, posSession.Data.UUID);
            Console.WriteLine("connected from terminal " + Context.ConnectionId + " " + posSession.Data.UUID);
            await Clients.Caller.SendAsync("ReceivedJoinScanner", $"✅ Terminal {posSession.Data.UUID} joined successfully");
            await Clients.OthersInGroup(posSession.Data.UUID).SendAsync(
                "ScannerConnected",
                $"📱 A new scanner joined terminal {posSession.Data.UUID}"
            );
        }
    }
}