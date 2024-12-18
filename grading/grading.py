
def gradeFile(actualInput, expectedInput):
    maxScore = len(expectedInput)
    score = 0
    for i in reversed(actualInput):
        if actualInput[i] == expectedInput[i]:
            score += 1
    return score
