export const capitalizeFirst = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|-|["'([{])+\S/g, match => match.toUpperCase());