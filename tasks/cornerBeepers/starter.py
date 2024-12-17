# დებს თითო ბიპერს ყოველ კუთხეში
from karel.stanfordkarel import *
def main():
    # repeat the body 4 times 
    for i in range(4):
        put_beeper()
        move()
        move()
        move()
        turn_left()