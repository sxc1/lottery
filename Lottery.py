import random
import csv
import sys

def readFileToDict(filename):
    with open(filename, mode = 'r') as file:
        fileReader = csv.reader(file)
        # dump header
        next(fileReader)

        # build freq dict
        totalDrawings = 0
        frequencies = {}
        for row in fileReader:
            n, ct = int(row[0]), int(row[1])
            totalDrawings += ct
            frequencies[n] = ct

        # convert from count to proportion
        for key in frequencies:
            frequencies[key] = frequencies[key] / totalDrawings
        
        return frequencies
    
def draw(dict, ct):
    # Draw
    drawing = sorted(random.choices(list(dict.keys()), weights = list(dict.values()), k = ct))

    # Redo draw if there's duplicates
    while ct > 1 and (drawing[0] == drawing[1] or drawing[1] == drawing[2] or drawing[2] == drawing[3] or drawing[3] == drawing[4]):
        drawing = sorted(random.choices(list(dict.keys()), weights = list(dict.values()), k = ct))

    return drawing

def drawTickets(regularFreqs, megaPowerFreqs, ct):
    for i in range(ct):
        drawing = draw(regularFreqs, 5)
        drawing += draw(megaPowerFreqs, 1)
        print(drawing)

# Check args
if len(sys.argv) != 2 or sys.argv[1] not in ('m', 'M', 'p', 'P'):
    raise Exception("Incorrect arguments provided. Script usage: 'Lottery.py m' for MegaMillions or 'Lottery.py p' for Powerball'")

# Generate probability distribution dicts
if sys.argv[1] in ('m', 'M'):
    print('Generating 5 MegaMillions tickets using a mixed-strategy Nash Equilibrium: ')
    regularFreqs = readFileToDict('./data/megamillions/normalball.csv')
    megaFreqs = readFileToDict('./data/megamillions/specialball.csv')
    drawTickets(regularFreqs, megaFreqs, 5)
    print('Probability distribution source: https://www.usamega.com/mega-millions/statistics')

elif sys.argv[1] in ('p', 'P'):
    print('Generating 5 PowerBall tickets using a mixed-strategy Nash Equilibrium: ')
    regularFreqs = readFileToDict('./data/powerball/normalball.csv')
    powerFreqs = readFileToDict('./data/powerball/specialball.csv')
    drawTickets(regularFreqs, powerFreqs, 5)
    print('Probability distribution source: https://www.usamega.com/powerball/statistics')



