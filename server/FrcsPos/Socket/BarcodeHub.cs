using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.SignalR;

namespace FrcsPos.Socket
{
    public class BarcodeHub : Hub
    {
        public async Task SendBardcodeToTerminal(string userId, string sku)
        {
            await Clients.User(userId).SendAsync("ReceiveBarcode", sku);
        }

        // Broadcast to all connected users
        public async Task BroadcastNotification(NotificationDTO notification)
        {
            await Clients.All.SendAsync("ReceiveNotification", notification);
        }
    }
}