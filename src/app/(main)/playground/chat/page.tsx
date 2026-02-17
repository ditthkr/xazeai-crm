import { ChatPlayground } from "../_components/chat-playground";

export default function PlaygroundChatPage() {
    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Playground</h1>
                    <p className="text-muted-foreground">
                        Test your AI personas and knowledge bases in real-time.
                    </p>
                </div>
            </div>

            <ChatPlayground />
        </div>
    );
}
