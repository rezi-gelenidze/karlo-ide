# დებს 5-5 ბიპერს ყოველ კუთხეში
def main():
    # გამეორება 4_ჯერ თითეული კუთხისთვის
    for i in range(4):
        put_five_beepers()
        move_to_next_corner()

# კარელის გადაადგილება შემდეგ კუთხემდე
def move_to_next_corner() :
    move()
    move()
    move()
    turn_left()

# დებს 5 ბიპერს for ციკლის გამოყენებით
def put_five_beepers() :
    for i in range(5):
        put_beeper()