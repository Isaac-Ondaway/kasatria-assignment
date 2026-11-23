
const SPREADSHEET_ID =
    '1-e8lJ1uKJ45ptr7FleM91SOajS1KpUfFLRGcb1g7vzs';

const SHEET_RANGE = 'Sheet1!A:F';

export async function loadPeople(accessToken) {
    const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.error?.message || 'Failed to retrieve Google Sheets data'
        );
    }

    const result = await response.json();
    const rows = result.values;

    if (!rows || rows.length < 2) {
        throw new Error('The spreadsheet contains no data.');
    }

    // First row contains the column headers.
    const headers = rows[0].map(header => header.trim());

    // Convert each remaining row into a person object.
    const people = rows.slice(1).map(row => {
        const person = {};

        headers.forEach((header, index) => {
            person[header] = row[index] ?? '';
        });

        return {
            name: person.Name?.trim(),
            photo: person.Photo?.trim(),
            age: Number(person.Age),
            country: person.Country?.trim(),
            interest: person.Interest?.trim(),
            netWorth: Number(
                person['Net Worth']?.replace(/[$,\s]/g, '')
            )
        };
    });

    console.log(`Successfully loaded ${people.length} records from Google Sheets`);

    return people;
}

export function getNetWorthColor(netWorth) {
    if (netWorth < 100000) return 'red';
    if (netWorth <= 200000) return 'orange';
    return 'green';
}
