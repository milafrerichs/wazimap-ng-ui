import {numFmt, percFmt, Observable, setPopupStyle} from '../utils';

let tooltipCategoryItem = null;

/**
 * this class creates & manipulates the popup over the map
 */
export class Popup extends Observable {
    constructor(_map) {
        super();

        this.map = _map;
        this.prepareDomElements();
    }

    prepareDomElements = () => {
        this.map.map_variables.tooltipItem = $(this.map.map_variables.tooltipClsName)[0].cloneNode(true);
        tooltipCategoryItem = $('.tooltip__point_item')[0].cloneNode(true);
    }

    loadPopup(payload, state) {
        const popupContent = this.createPopupContent(payload, state);

        this.map.map_variables.popup = L.popup({
            autoPan: false,
            offset: [-10, 0],
            closeButton: false
        })

        this.map.map_variables.popup
            .setLatLng(payload.element.latlng)
            .setContent(popupContent)
            .openOn(this.map);

        //openOn -> closes with map.closePopup()
        //addTo -> doesnt close with map.closePopup()

        setPopupStyle('map-tooltip')
    }

    updatePopupPosition(payload) {
        if (this.map.map_variables.popup === null) {
            this.loadPopup(payload.payload.layer, payload.state);
        } else {
            payload.payload.popup.setLatLng(payload.payload.layer.element.latlng);
        }
    }

    hidePopup(payload) {
        this.map.closePopup();
    }

    createPopupContent = (payload, state) => {
        let item = this.map.map_variables.tooltipItem.cloneNode(true);

        this.map.map_variables.hoverAreaLevel = payload.properties.level;
        this.map.map_variables.hoverAreaCode = payload.layer.feature.properties.code;

        $('.map-tooltip__name div', item).text(payload.properties.name);
        $('.map-tooltip__geography-chip div', item).text(this.map.map_variables.hoverAreaLevel);
        var areaCode = payload.areaCode;

        this.setTooltipSubindicators(payload, state, item, areaCode);
        this.setTooltipThemes(item, areaCode);

        $(item).find('.tooltip__notch').remove();   //leafletjs already creates this

        return $(item).html();
    }

    setTooltipThemes = (item, areaCode) => {
        $(item).find('.map-tooltip__points').html('');  //empty wrapper first, then append the items
        return; // No longer display theme counts

        let child = this.map.map_variables.children.filter((c) => {
            return c.code === areaCode
        })[0];

        if (child !== null && typeof child !== 'undefined') {
            if (child.categories.length > 0) {
                $(item).find('.map__tooltip_points').html('');  //empty wrapper first, then append the items

                child.categories.forEach((c, i) => {
                    let tooltipRow = tooltipCategoryItem.cloneNode(true);
                    if (i === child.categories.length - 1) {
                        $(tooltipRow).addClass('last');
                    }

                    $('.tooltip__points_label div', tooltipRow).text(c.categoryName);
                    $('.tooltip__value_amount div', tooltipRow).text(c.count);

                    $(item).find('.map-tooltip__points').append(tooltipRow);
                })
            } else {
                $(item).find('.map-tooltip__points').remove();
            }
        } else {
            $(item).find('.map-tooltip__points').remove();
        }
    }

    setTooltipSubindicators = (payload, state, item, areaCode) => {
        if (state.subindicator != null) {
            //if any subindicator selected
            let isChild = false;
            for (const [geographyCode, count] of Object.entries(state.subindicator.children)) {
                if (geographyCode == areaCode) {
                    isChild = true;
                    const countFmt = numFmt(count);
                    const perc = percFmt(payload.layer.feature.properties.percentage);

                    $('.map-tooltip__value .tooltip__value_label div', item).text(`${state.subindicator.indicatorTitle} (${state.selectedSubindicator})`);
                    $('.map-tooltip__value .tooltip__value_amount div', item).text(countFmt);
                    if (state.subindicator.choropleth_method != 'absolute_value') {
                        $('.map-tooltip__value .tooltip__value_detail div', item).text(`(${perc} %)`);
                    } else {
                        $('.map-tooltip__value .tooltip__value_detail div', item).text('');
                    }
                }
            }

            if (!isChild){
                $(item).find('.map-tooltip__value').remove();
            }
        } else {
            $(item).find('.map-tooltip__value').remove();
        }
    }
}
