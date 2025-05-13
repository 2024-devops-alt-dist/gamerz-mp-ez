import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";

const backendUri = import.meta.env.VITE_BACKEND_URI;

type Message = {
    _id?: string;
    sender: {
        _id: string;
        username: string;
    };
    content: string;
    timestamp?: string;
};

type Props = {
    user: {
        _id: string;
        username: string;
        roles: string[];
    };
};

export default function Chat({ user }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasGamerzRole = user?.roles?.includes("ROLE_GAMERZ");

    useEffect(() => {
        // Connect socket only once a user is loaded
        const newSocket = io(`${backendUri}`, {
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            console.log("Connected to socket server");
        });

        newSocket.on("load_messages", (loadedMessages: Message[]) => {
            setMessages(loadedMessages);
        });

        newSocket.on("receive_message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user._id]); // Ensures it runs when user is available

    const handleSend = () => {
        if (newMessage.trim() === "" || !socket || !hasGamerzRole) return;
        socket.emit("send_message", {
            sender: user._id,
            content: newMessage,
        });
        setNewMessage("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "1rem" }}>
            <h4>Chat Gamerz de haute amplitude</h4>
            <div style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "#f9f9f9"
            }}>
                {messages.map((msg) => (
                    <div key={msg._id || Math.random()} style={{ marginBottom: "5px" }}>
                        {msg.timestamp && (
                            <>
                                <span style={{ color: "#888" }}>
                                    {format(new Date(msg.timestamp), "dd/MM/yyyy HH:mm")}
                                </span>
                                <span> - </span>
                            </>
                        )}
                        <strong>{msg.sender.username}</strong>: {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {!hasGamerzRole && (
                <div className="text-danger mt-2">
                    Seuls les utilisateurs <strong>acceptés</strong> peuvent envoyer des messages.
                </div>
            )}

            <div className="input-group mt-2">
                <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écris ton message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={!hasGamerzRole}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSend}
                    disabled={!hasGamerzRole}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}
