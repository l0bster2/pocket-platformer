class Collision {

    static staticConstructor(tileMapHandler) {
        this.tileMapHandler = tileMapHandler;
    }

    static objectsColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width + obj2.hitBoxOffset &&
            obj1.x + obj1.width > obj2.x - obj2.hitBoxOffset &&
            obj1.y < obj2.y + obj2.height + obj2.hitBoxOffset &&
            obj1.y + obj1.height > obj2.y - obj2.hitBoxOffset;
    }

    static pointAndObjectColliding(point, obj) {
        return point.x < obj.x + obj.width &&
        point.x > obj.x &&
        point.y < obj.y + obj.height &&
        point.y > obj.y;
    }
}