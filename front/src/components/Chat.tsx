import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { format } from "date-fns";

const socket = io("http://localhost:5000", {
    withCredentials: true,
});

type Message = {
    _id?: string;
    sender: {
        _id: string;
        username: string;
    };
    content: string;
    timestamp?: string;
};

export default function Chat({ user }: { user: { _id: string; username: string } }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("load_messages", (loadedMessages: Message[]) => {
            setMessages(loadedMessages);
        });

        socket.on("receive_message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("load_messages");
            socket.off("receive_message");
        };
    }, []);

    const handleSend = () => {
        if (newMessage.trim() === "") return;
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
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
            <h4>💬 Chat Gamerz de haute amplitude</h4>
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
                        {format(new Date(msg.timestamp as string), "dd/MM/yyyy HH:mm")} 
                        <span> - </span><strong>{msg.sender.username}</strong>: {msg.content}
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>
            <div className="input-group mt-2">
                <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écris ton message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button className="btn btn-primary" onClick={handleSend}>
                    Envoyer
                </button>
            </div>
        </div>
    );
}
