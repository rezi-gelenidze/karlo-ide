def main():
    move()
    fill_pothole()
    move()

# კარელი ავსებს მის წინ მდებარე ორმოს მასში ბიპერის მოთავსებით.
def fill_pothole():
    turn_right()
    move()
    put_beeper()
    turn_around()
    move()
    turn_right()

# აბრუნებს კარელს მარჯვნივ (90 გრადუსი)
def turn_right():
    turn_left()
    turn_left()
    turn_left()

# აბრუნებს კარელს უკან (180 გრადუსი)
def turn_around():
    turn_left()
    turn_left()