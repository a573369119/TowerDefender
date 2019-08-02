"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grass_1 = require("./Grass");
var GrassFactory = /** @class */ (function () {
    function GrassFactory(camp, view) {
        this.grassArray = new Array();
        this.mudArray = new Array();
        this.createGrassArray(camp, view);
    }
    /**生成草坪 */
    GrassFactory.prototype.createGrassArray = function (camp, view) {
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 10; j++) {
                var grass = void 0;
                if (i % 2 == 0) {
                    grass = new Grass_1.default(j % 2 + 1, view);
                }
                else {
                    grass = new Grass_1.default((j + 1) % 2 + 1, view);
                }
                this.grassArray.push(grass);
                if (camp == "red") {
                    grass.sp.pos(120 + 100 * j, 25 + 100 * i);
                }
                else {
                    grass.sp.pos(1759 + 100 * j, 25 + 100 * i);
                }
            }
        }
    };
    return GrassFactory;
}());
exports.default = GrassFactory;
