using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.SignalR;

namespace FrcsPos.Socket
{
    public class PosHub : Hub
    {
        // Phone scanner sends barcode → forward to terminal
        public async Task SendScan(string terminalId, string sku)
        {
            await Clients.Group(terminalId).SendAsync("ReceiveScan", sku);
        }

        // POS terminal joins its group
        public async Task JoinTerminal(string terminalId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, terminalId);
        }

        // Scanner joins the same group
        public async Task JoinScanner(string terminalId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, terminalId);
        }
    }
}