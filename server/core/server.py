import asyncio
import websockets

class Server():

	def __init__(self, ip, port):
		self.__ip = ip
		self.__port = port

	async def start(self, sock, addr):
		print("New Connection!")

	def run(self):
		myServe = websockets.serve(self.start, self.__ip, self.__port)

		asyncio.get_event_loop().run_until_complete(myServe)
		asyncio.get_event_loop().run_forever()
