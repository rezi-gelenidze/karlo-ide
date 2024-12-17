# ფაილი: BeeperPickingKarel.py
# -----------------------------
# კარელი იღებს ბიპერს და ათავსებს მას რაფაზე
def main():
    move()
    pick_beeper()
    move()
    turn_left()
    move()
    turn_right()
    move()
    move()
    put_beeper()
    move()

def turn_right():
    turn_left()
    turn_left()
    turn_left()