def calculate_bill(units):

    # 0–100 units
    if units <= 100:
        return 0

    # 101–200 units
    elif units <= 200:
        return (
            (100 * 0)
            + ((units - 100) * 2.5)
        )

    # 201–400 units
    elif units <= 400:
        return (
            (100 * 0)
            + (100 * 2.5)
            + ((units - 200) * 4.5)
        )

    # Above 400 units
    else:
        return (
            (100 * 0)
            + (100 * 2.5)
            + (200 * 4.5)
            + ((units - 400) * 6)
        )