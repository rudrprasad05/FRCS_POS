using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.SignalR;

namespace FrcsPos.Socket
{
    public class NotificationHub : Hub
    {
        public async Task SendNotificationToUser(string userId, NotificationDTO notification)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", notification);
        }

        // Broadcast to all connected users
        public async Task BroadcastNotification(NotificationDTO notification)
        {
            await Clients.All.SendAsync("ReceiveNotification", notification);
        }
    }
}