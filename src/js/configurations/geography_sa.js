export const geography_config = {
    rootGeography: 'ZA',
    preferredChildren: {
        country: ['province'],
        province: ['district', 'municipality'],
        district: ['municipality'],
        municipality: ['mainplace', 'planning_region'],
        mainplace: ['subplace']
    },
    geoViewTypes: {
        mainplace: ['mainplace', 'subplace'],
        ward: ['ward']
    },
    geographyLevels: {
        country: 'Country',
        province: 'Province',
        district: 'District',
        municipality: 'Municipality',
        mainplace: 'Mainplace',
        subplace: 'Subplace',
        ward: 'Ward'
    },
    individualMarkerLevels: ['mainplace', 'subplace', 'ward'],
    map: {
        defaultCoordinates: {'lat': -28.995409163308832, 'long': 25.093833387362697, 'zoom': 6},
        tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoomControlEnabled: false,
        zoomEnabled: false,
        zoomPosition: 'bottomright',
        limitGeoViewSelections: true // TODO temporary until specific geographies are factored out of the code
    }
}