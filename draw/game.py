
# Import and initialize the pygame library
import pygame


pygame.init()

size = 500

display_size = [size, size]

# Set up the drawing window
screen = pygame.display.set_mode(display_size)

# Run until the user asks to quit
running = True
while running:

    # Did the user click the window close button?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the background with white
    screen.fill((255, 255, 255))

    # Draw a solid blue circle in the center
    pygame.draw.rect(screen, (0, 0, 0), (0, 0, 10, 10), 0)

    # Flip the display
    pygame.display.flip()

# Done! Time to quit.
pygame.quit()
