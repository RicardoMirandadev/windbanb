export async function loadStays() {
    const response = await fetch('/data/stays.json');
    const stays = await response.json();
    return stays;
}