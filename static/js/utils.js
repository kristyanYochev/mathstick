function distance_between_points(x1, y1, x2, y2)
{
    return Math.sqrt(
        ((x1-x2) ** 2) + ((y1-y2) ** 2)
    )
}

function conatins_all(arr1, arr2)
{
    return arr1.every(arr1_item => arr2.includes(arr1_item))
}

function arrays_have_same_members(arr1, arr2)
{
    return conatins_all(arr1, arr2) && conatins_all(arr2, arr1)
}