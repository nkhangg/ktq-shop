import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class KtqEventsSseService {
    private clients: Map<string, Map<string, Response>> = new Map();

    // Thêm client vào danh sách theo sự kiện và id
    addClient(res: Response, event: string, clientId: string) {
        if (!this.clients.has(event)) {
            this.clients.set(event, new Map());
        }

        const eventClients = this.clients.get(event)!;
        eventClients.set(clientId, res);

        res.on('close', () => {
            this.removeClient(event, clientId);
        });
    }

    // Xóa client khỏi danh sách theo sự kiện và id
    removeClient(event: string, clientId: string) {
        if (this.clients.has(event)) {
            const eventClients = this.clients.get(event)!;
            if (eventClients.has(clientId)) {
                eventClients.get(clientId)?.end();
                eventClients.delete(clientId);
            }
        }
    }

    // Gửi sự kiện đến một client cụ thể
    sendToClient(event: string, clientId: string, data: Record<string, any>) {
        const eventClients = this.clients.get(event);

        if (eventClients && eventClients.has(clientId)) {
            const client = eventClients.get(clientId)!;

            if (!client.writableEnded) {
                client.write(`data: ${JSON.stringify(data)}\n\n`);
            }
        }
    }

    // Phát sự kiện đến tất cả client của một sự kiện
    broadcastEvent(event: string, data: Record<string, any>) {
        const eventClients = this.clients.get(event);

        if (eventClients) {
            eventClients.forEach((client) => {
                if (!client.writableEnded) {
                    client.write(`data: ${JSON.stringify(data)}\n\n`);
                }
            });
        }
    }
}
