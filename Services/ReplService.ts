import * as repl from 'repl';
import * as net from 'net';

class ReplService {
    private commands: { [key: string]: Function } = {};
    private replServer;

    constructor() {
        this.addCommand('listCommands', async () => {
            return `Available commands: ${Object.keys(replService.commands).join(', ')}`;
        });
    }

    // Add a new command to the REPL
    public addCommand(commandName: string, commandFunction: Function) {
        this.commands[commandName] = commandFunction;
    }

    // Invoke a command by its name
    public async invokeCommand(commandName: string, ...args: any[]) {
        const command = this.commands[commandName];
        if (command) {
            return await command(...args);
        } else {
            console.log(`Command '${commandName}' not found.`);
            return `Command '${commandName}' not found.`;
        }
    }

    // Start the REPL with integrated commands
    public startRepl(prompt: string) {
        net.createServer((socket) => {
            this.replServer = repl.start({
                prompt: prompt,
                input: socket,
                output: socket,
                eval: async (cmd, context, filename, callback) => {
                    try {
                        const [commandName, ...args] = cmd.trim().split(' ');
                        const result = await this.invokeCommand(commandName, ...args);
                        callback(null, result);
                    } catch (err) {
                        callback(null, err);
                    }
                }
            });

            // Expose the ReplService instance to the REPL context
            this.replServer.context.replService = this;

            this.replServer.on('exit', () => {
                socket.end();
            });
        }).listen(3001, '127.0.0.1', () => {
            console.log('REPL server listening on port 3001');
        });
    }

    // Method to prompt user for input via the REPL
    public async prompt(message: string, callback?: (input: string) => void): Promise<void> {
        const rl = repl.start({ prompt: message, input: process.stdin, output: process.stdout });
        rl.on('line', (input) => {
            rl.close();
            if (callback) {
                callback(input.trim());
            }
        });
    }

    public getReplServer() {
        return this.replServer;
    }
}

const replService = new ReplService();
export default replService;
