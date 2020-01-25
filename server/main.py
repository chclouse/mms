from core.server import *
import sys

def main(argv):
	newServer = Server("10.82.36.172", 8763)
	newServer.run()

if __name__ == '__main__':
	sys.exit(main(sys.argv))
