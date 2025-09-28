namespace FrcsPos.Request
{
    public class AdminApprovalRequest
    {
        public string AdminUsernameOrEmail { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = string.Empty;
    }
}
