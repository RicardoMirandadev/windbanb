export async function loadStays() {
    const response = await fetch('/src/data/stays.json');
    const stays = await response.json();
    return stays;
}