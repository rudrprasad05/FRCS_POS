using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class WebSocketDTO
    {
        public WebSocketType Type { get; set; } = WebSocketType.PING;
        public string? SessionId { get; set; }          
        public string? Payload { get; set; }            
    }

    public enum WebSocketType
    {
        SCAN, PING
    }
}