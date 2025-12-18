namespace Talaqi.Domain.Enums.Messaging
{
    public enum MessageType
    {
        Text = 0,
        Image = 1,
        File = 2,
        Voice = 3,
        Video = 4,
        Location = 5,
        Contact = 6,
        System = 99 // For "User created group", "User left", etc.
    }
}
