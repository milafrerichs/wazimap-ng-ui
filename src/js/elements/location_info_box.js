import {Observable, numFmt} from '../utils';
import {Profile} from '../profile';

const container = $('.map-location');
const breadcrumbsContainer = $('.map-location__tags', container);
const metricContainer = $('.map-location__info', container);

const breadcrumbTemplate = $('.location-tag')[0];
const metricTemplate = $('.location-highlight')[0].cloneNode(true);

const infoContainer = $('.map__location-info', container);

export class LocationInfoBox extends Observable {
    constructor() {
        super();
    }

    update(dataBundle) {
        const profile = dataBundle.profile;
        const locations = [...profile.parents, profile.geography]

        this.updateBreadcrumbs(locations);
        this.updateHighlights(profile.highlights);
    }

    updateHighlights(highlights) {
        const metricContainers = $('.location-highlight').remove();
        let metric = null;
        highlights.forEach(function (highlight) {
            metric = metricTemplate.cloneNode(true);
            $('.location-highlight__value', metric).text(highlight.value);
            $('.location-highlight__title', metric).text(highlight.label);
            metricContainer.append(metric);

        })

        $(metric).addClass('last');
    }

    updateBreadcrumbs(locations, clear = true) {
        //clear = false when user clicks the map, clear = true on page load

        const self = this;
        if (clear) {
            $('.location-tag', breadcrumbsContainer).remove();
            $('.location-tag__loading', breadcrumbsContainer).remove();
        }

        let locationElement = null;
        locations.forEach((location, i) => {
            locationElement = breadcrumbTemplate.cloneNode(true);

            $('.truncate', locationElement).text(location.name);
            $('.location-tag__type div', locationElement).text(location.level);
            if (clear) {
                $(locationElement).find('.location-tag__loading-icon').addClass('hidden');
            }

            if (i === locations.length - 1) {
                //last item
                $(locationElement).addClass('active');
            }

            $(locationElement).on('click', el => {
                self.triggerEvent('location_infobox.breadcrumbs.selected', location);
                $(locationElement).off("click")
            })

            breadcrumbsContainer.append(locationElement);
        })
    }

    updateLocations(locations) {
        this.updateBreadcrumbs(locations, false);
    }
}
