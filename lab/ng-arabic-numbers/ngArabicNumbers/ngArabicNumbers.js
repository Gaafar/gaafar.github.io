'use strict';

angular.module('arabic-numbers', [])

    .filter('arabicNumbers', function () {

        var numbers = {
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩',
            '0': '٠',
            ':': ':'
        }

        function arabize(input, isArabic) {
            if (!isArabic) return input;
            var str = '';
            var arr = input.toString().split("");

            for (var i = 0; i < arr.length; i++) {
                str += numbers[arr[i]]!=undefined? numbers[arr[i]]: arr[i];
            }
            return str;
        }

        return arabize;
    });

