export async function loadStays() {
    const response = await fetch('/public/data/stays.json');
    const stays = await response.json();
    return stays;
}