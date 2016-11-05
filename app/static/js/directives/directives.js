// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('linc.directive', [])

.directive('limlatlng', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ctrl) {
      var el = elem;
      var limit = parseInt(attr.limlatlng,10);

      var toModel = function (val) {
        return val.replace(/,/g, '.') ;
      };
      ctrl.$parsers.unshift(toModel);

      ctrl.$validators.limlatlng = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) return true;

        if(typeof modelValue === 'number' || modelValue instanceof Number)  return true;

        var val = modelValue.replace(/,/g, '.') ;
        var num = parseFloat(val);
        if(isNaN(num) || (num && (num.toString() != val)))
          return true;
        else if(Math.abs(num) > limit)
          return false;
        else
          return true;
      };
    }
  };
})

.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
})

.directive('scaleImage', function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      var parent = elm.parent().parent().parent().parent();
      scope.$watch(function () {
        return {
            maxWidth: parent.prop('offsetHeight'),
            maxHeight: parent.prop('offsetWidth') - 100,
            Width: elm[0].naturalWidth,
            Height: elm[0].naturalHeight
        };
      }, function (size) {
        var tRatio = size.Width / size.maxWidth;
        var tProportionalHeight =  size.Height / tRatio;

        var tRatio = size.Height / size.maxHeight
        var tProportionalWidth = size.Width / tRatio;

        if (tProportionalHeight > size.maxHeight){
          elm.css('height', size.maxHeight + 'px');
          elm.css('width', tProportionalWidth + 'px');
        }
        else{
          elm.css('width', size.maxWidth + 'px');
          elm.css('height', tProportionalHeight + 'px');
        }
      }, true);
    }
  };
})

.directive('nxEqualEx', function() {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, model) {
      if (!attrs.nxEqualEx) {
        console.error('nxEqualEx expects a model as an argument!');
        return;
      }
      scope.$watch(attrs.nxEqualEx, function (value) {
        // Only compare values if the second ctrl has a value.
        if (model.$viewValue !== undefined && model.$viewValue !== '') {
          model.$setValidity('nxEqualEx', value === model.$viewValue);
        }
      });
      model.$parsers.push(function (value) {
        // Mute the nxEqual error if the second ctrl is empty.
        if (value === undefined || value === '') {
          model.$setValidity('nxEqualEx', true);
          return value;
        }
        var isValid = value === scope.$eval(attrs.nxEqualEx);
        model.$setValidity('nxEqualEx', isValid);
        scope.$parent.$parent.showValidationMessages=false;
        return isValid ? value : undefined;
      });
    }
  };
})

/*.directive('watchScope', [function () {
  return {
    scope: {
      item: '=watchScope'
    },
    link: function (scope, element, attrs) {
      console.log('element ' + scope.item.name + ' created');
    }
  };
}])*/

.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) { // all are rendered
      scope.$eval(attrs.repeatDone);
    }
  }
})

/*.directive('uiSrefActiveIf', ['$state', function($state) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      var state = $attrs.uiSrefActiveIf;
      function update() {
        if ( $state.includes(state) || $state.is(state) ) {
          $element.addClass("active");
        } else {
          $element.removeClass("active");
        }
      }
      $scope.$on('$stateChangeSuccess', update);
      update();
    }]
  };
}])*/

/**
 * Provides with pagination with infinite scroll to handle large list of choices. 
 * An upfront large list of choices makes the control unstable and unresponsive.
 * This feature avoid populaing the list upfront by pagination which is the primary cause of unstability.
 * Pagination works in 2 scenarios:-
 * 
 * 1) Simple scrolling of the contents.
 * 2) Scrolling when the Autocomplete/search text is enteded and the results are still too large.
 * 
 * @example
    <ui-select-choices position="up" all-choices="ctrl.allTenThousandItems"  refresh-delay="0"
        repeat="person in $select.pageOptions.people | propsFilter: {name: $select.search, age: $select.search} ">
      <div ng-bind-html="person.name | highlight: $select.search"></div>
      <small>
        email: {{person.email}}
        age: <span ng-bind-html="''+person.age | highlight: $select.search"></span>
      </small>
    </ui-select-choices>
 * 
 * 
 */
 .directive('uiSelectChoices', ['$timeout', '$parse', '$compile', '$document', '$filter', 
  function($timeout, $parse, $compile, $document, $filter) {
  return function(scope, elm, attr) {
    var raw = elm[0];
    var scrollCompleted = true;
    if (!attr.allChoices) {
      return;
    }

    scope.pagingOptions = {
      allOptions: scope.$eval(attr.allChoices)
    };

    attr.refresh = 'addMoreItems()';
    var refreshCallBack = $parse(attr.refresh);
    elm.bind('scroll', function(event) {
      var remainingHeight = raw.offsetHeight - raw.scrollHeight;
      var scrollTop = raw.scrollTop;
      var percent = Math.abs((scrollTop / remainingHeight) * 100);

      if (percent >= 80) {
        if (scrollCompleted) {
          scrollCompleted = false;
          event.preventDefault();
          event.stopPropagation();
          var callback = function() {
            scope.addingMore = true;
            refreshCallBack(scope, {
              $event: event
            });
            scrollCompleted = true;

          };
          $timeout(callback, 100);
        }
      }
    });

    var closeDestroyer = scope.$on('uis:close', function() {
      var pagingOptions = scope.$select.pagingOptions || {};
      pagingOptions.filteredItems = undefined;
      pagingOptions.page = 0;
    });

    scope.addMoreItems = function(doneCalBack) {
      console.log('new addMoreItems');
      var $select = scope.$select;
      var allItems = scope.pagingOptions.allOptions;
      var moreItems = [];
      var itemsThreshold = 100;
      var search = $select.search;

      var pagingOptions = $select.pagingOptions = $select.pagingOptions || {
        page: 0,
        pageSize: 20,
        items: $select.items
      };

      if (pagingOptions.page === 0) {
        pagingOptions.items.length = 0;
      }
      if (!pagingOptions.originalAllItems) {
        pagingOptions.originalAllItems = scope.pagingOptions.allOptions;
      }
      console.log('search term=' + search);
      console.log('prev search term=' + pagingOptions.prevSearch);
      var searchDidNotChange = search && pagingOptions.prevSearch && search == pagingOptions.prevSearch;
      console.log('isSearchChanged=' + searchDidNotChange);
      if (pagingOptions.filteredItems && searchDidNotChange) {
        allItems = pagingOptions.filteredItems;
      }
      pagingOptions.prevSearch = search;
      if (search && search.length > 0 && pagingOptions.items.length < allItems.length && !searchDidNotChange) {
        //search


        if (!pagingOptions.filteredItems) {
          //console.log('previous ' + pagingOptions.filteredItems);
        }

        pagingOptions.filteredItems = undefined;
        moreItems = $filter('filter')(pagingOptions.originalAllItems, search);
        //if filtered items are too many scrolling should occur for filtered items
        if (moreItems.length > itemsThreshold) {
          if (!pagingOptions.filteredItems) {
            pagingOptions.page = 0;
            pagingOptions.items.length = 0;
          } else {

          }
          pagingOptions.page = 0;
          pagingOptions.items.length = 0;
          allItems = pagingOptions.filteredItems = moreItems;

        } else {
          allItems = moreItems;
          pagingOptions.items.length = 0;
          pagingOptions.filteredItems = undefined;
        }


      } else {
        console.log('plain paging');
      }
      pagingOptions.page++;
      if (pagingOptions.page * pagingOptions.pageSize < allItems.length) {
        moreItems = allItems.slice(pagingOptions.items.length, pagingOptions.page * pagingOptions.pageSize);
      }

      for (var k = 0; k < moreItems.length; k++) {
        pagingOptions.items.push(moreItems[k]);
      }

      scope.calculateDropdownPos();
      scope.$broadcast('uis:refresh');
      if (doneCalBack) doneCalBack();
    };
    scope.$on('$destroy', function() {
      elm.off('scroll');
      closeDestroyer();
    });
  };
}])


// .directive('uiSelectChoices', ['$timeout', '$parse', '$compile', '$document', '$filter', 
//   function($timeout, $parse, $compile, $document, $filter) {
//     return function(scope, elm, attr) {
//     var raw = elm[0];
//     var scrollCompleted = true;
//     if (!attr.allChoices) {
//       throw new Error('ief:ui-select: Attribute all-choices is required in  ui-select-choices so that we can handle  pagination.');
//     }

//     scope.pagingOptions = {
//       allOptions: scope.$eval(attr.allChoices)
//     };

//     attr.refresh = 'addMoreItems()';
//     var refreshCallBack = $parse(attr.refresh);
//     elm.bind('scroll', function(event) {
//       var remainingHeight = raw.offsetHeight - raw.scrollHeight;
//       var scrollTop = raw.scrollTop;
//       var percent = Math.abs((scrollTop / remainingHeight) * 100);

//       if (percent >= 80) {
//         if (scrollCompleted) {
//           scrollCompleted = false;
//           event.preventDefault();
//           event.stopPropagation();
//           var callback = function() {
//             scope.addingMore = true;
//             refreshCallBack(scope, {
//               $event: event
//             });
//             scrollCompleted = true;

//           };
//           $timeout(callback, 100);
//         }
//       }
//     });

//     var closeDestroyer = scope.$on('uis:close', function() {
//       var pagingOptions = scope.$select.pagingOptions || {};
//       pagingOptions.filteredItems = undefined;
//       pagingOptions.page = 0;
//     });

//     scope.addMoreItems = function(doneCalBack) {
//       console.log('new addMoreItems');
//       var $select = scope.$select;
//       var allItems = scope.pagingOptions.allOptions;
//       var moreItems = [];
//       var itemsThreshold = 100;
//       var search = $select.search;

//       var pagingOptions = $select.pagingOptions = $select.pagingOptions || {
//         page: 0,
//         pageSize: 20,
//         items: $select.items
//       };

//       if (pagingOptions.page === 0) {
//         pagingOptions.items.length = 0;
//       }
//       if (!pagingOptions.originalAllItems) {
//         pagingOptions.originalAllItems = scope.pagingOptions.allOptions;
//       }
//       console.log('search term=' + search);
//       console.log('prev search term=' + pagingOptions.prevSearch);
//       var searchDidNotChange = search && pagingOptions.prevSearch && search == pagingOptions.prevSearch;
//       console.log('isSearchChanged=' + searchDidNotChange);
//       if (pagingOptions.filteredItems && searchDidNotChange) {
//         allItems = pagingOptions.filteredItems;
//       }
//       pagingOptions.prevSearch = search;
//       if (search && search.length > 0 && pagingOptions.items.length < allItems.length && !searchDidNotChange) {
//         //search


//         if (!pagingOptions.filteredItems) {
//           //console.log('previous ' + pagingOptions.filteredItems);
//         }

//         pagingOptions.filteredItems = undefined;
//         moreItems = $filter('filter')(pagingOptions.originalAllItems, search);
//         //if filtered items are too many scrolling should occur for filtered items
//         if (moreItems.length > itemsThreshold) {
//           if (!pagingOptions.filteredItems) {
//             pagingOptions.page = 0;
//             pagingOptions.items.length = 0;
//           } else {

//           }
//           pagingOptions.page = 0;
//           pagingOptions.items.length = 0;
//           allItems = pagingOptions.filteredItems = moreItems;

//         } else {
//           allItems = moreItems;
//           pagingOptions.items.length = 0;
//           pagingOptions.filteredItems = undefined;
//         }


//       } else {
//         console.log('plain paging');
//       }
//       pagingOptions.page++;
//       if (pagingOptions.page * pagingOptions.pageSize < allItems.length) {
//         moreItems = allItems.slice(pagingOptions.items.length, pagingOptions.page * pagingOptions.pageSize);
//       }

//       for (var k = 0; k < moreItems.length; k++) {
//         pagingOptions.items.push(moreItems[k]);
//       }

//       scope.calculateDropdownPos();
//       scope.$broadcast('uis:refresh');
//       if (doneCalBack) doneCalBack();
//     };
//     scope.$on('$destroy', function() {
//       elm.off('scroll');
//       closeDestroyer();
//     });
//   };
// }])

