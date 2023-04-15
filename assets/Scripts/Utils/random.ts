export const randomStringFromLength = (length: number) => {
    return Array.from({ length: length }).reduce<string>(
        (previousValue, currentValue) => previousValue + Math.floor(Math.random() * 10),
        "",
    );
};
