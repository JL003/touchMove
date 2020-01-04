// parent: parent Box js Element
// child: child Box js Element
// touchMove({
//     parent: document.getElementById('parent'),
//     child: document.getElementById('child'),
//     X: true,
//     addScroll: 20
// });
function touchMove(obj) {
    var el = obj.parent;
    var child = obj.child;
    var moveData = [];
    var moveRun = [];
    var runTimer = 0;
    obj.Y = obj.X ? false : true;
    obj.addScroll = obj.addScroll || 0;
    var item = {
        x: 0,
        y: 0,
        timer: 0
    };
    el.style.overflow = 'hidden';
    function runUp() {
        var time = moveRun[moveRun.length - 1].timer - moveRun[0].timer;
        var long = 0;
        if (obj.X) {
            long = moveRun[moveRun.length - 1].posx - moveRun[0].posx;
        } else {
            long = moveRun[moveRun.length - 1].posy - moveRun[0].posy;
        }
        var speed = Math.abs(long) / time;
        if (Math.abs(speed) > 0.3) {
            if (obj.X) {
                item.eX = item.eX - speed * 20;
                moveRun[0].posx = moveRun[0].posx + 8;
                if (item.eX >= 0) {
                    item.eX = 0;
                } else {
                    runTimer = window.requestAnimationFrame(runUp);
                }
            } else {
                item.eY = item.eY - speed * 20;
                moveRun[0].posy = moveRun[0].posy + 8;
                if (item.eY >= 0) {
                    item.eY = 0;
                } else {
                    runTimer = window.requestAnimationFrame(runUp);
                }
            }
            if (obj.X) {
                child.style.marginLeft = item.eX + 'px'
            }
            if (obj.Y) {
                child.style.marginTop = item.eY + 'px'
            }
        }
    }
    function runDown() {
        if (!moveRun[0]) {
            return false;
        }
        var time = moveRun[0].timer - moveRun[moveRun.length - 1].timer;
        var long = 0;
        if (obj.X) {
            long = moveRun[0].posx - moveRun[moveRun.length - 1].posx;
        } else {
            long = moveRun[0].posy - moveRun[moveRun.length - 1].posy
        }
        var speed = Math.abs(long) / time;
        if (Math.abs(speed) > 0.3) {
            if (obj.X) {
                item.eX = item.eX - speed * 20;
                moveRun[0].posx = moveRun[0].posx - 8;
                if (item.eX <= item.maxX) {
                    item.eX = item.maxX;
                } else {
                    runTimer = window.requestAnimationFrame(runDown);
                }
            } else {
                item.eY = item.eY - speed * 20;
                moveRun[0].posy = moveRun[0].posy - 8;
                if (item.eY <= item.maxY) {
                    item.eY = item.maxY;
                } else {
                    runTimer = window.requestAnimationFrame(runDown);
                }
            }
            if (obj.X) {
                child.style.marginLeft = item.eX + 'px'
            }
            if (obj.Y) {
                child.style.marginTop = item.eY + 'px'
            }
        }
    }
    function runBack() {
        if (item.eY > 0 && obj.Y) {
            item.eY = item.eY - item.eY * 0.3;
            if (item.eY < 1) {
                item.eY = 0;
            } else {
                item.timer = window.requestAnimationFrame(runBack);
            }
            child.style.marginTop = item.eY + 'px';
        } else if (item.eY < item.maxY && obj.Y) {
            item.eY = item.eY - (item.eY - item.maxY) * 0.3;
            if (item.eY > item.maxY - 1) {
                item.eY = item.maxY;
            } else {
                item.timer = window.requestAnimationFrame(runBack);
            }
            child.style.marginTop = item.eY + 'px'
        } else if (item.eX > 0 && obj.X) {
            item.eX = item.eX - item.eX * 0.3;
            if (item.eX < 1) {
                item.eX = 0;
            } else {
                item.timer = window.requestAnimationFrame(runBack);
            }
            child.style.marginLeft = item.eX + 'px';
        } else if (item.eX < item.maxX && obj.X) {
            item.eX = item.eX - (item.eX - item.maxX) * 0.3;
            if (item.eX > item.maxX - 1) {
                item.eX = item.maxX;
            } else {
                item.timer = window.requestAnimationFrame(runBack);
            }
            child.style.marginLeft = item.eX + 'px';
        } else if (moveRun.length < 1) {
            var startSpeed = 0;
            var lastNum = 0;
            var negative = false;
            if (obj.X) {
                for (var i = moveData.length - 1; i >= 0; i--) {
                    if (moveRun.length < 2) {
                        moveRun.push(moveData[i]);
                        switch (moveRun.length) {
                            case 1:
                                startSpeed = moveData[i].posx;
                                break;
                            case 2:
                                lastNum = moveData[i].posx;
                                break;
                        }
                        negative = startSpeed < lastNum;
                    } else if ((negative && lastNum < moveData[i].posx) || (!negative && lastNum > moveData[i].posx)) {
                        lastNum = moveData[i].posx;
                        moveRun.push(moveData[i]);
                    } else {
                        break;
                    }
                }
            } else {
                for (var i = moveData.length - 1; i >= 0; i--) {
                    if (moveRun.length < 2) {
                        moveRun.push(moveData[i]);
                        switch (moveRun.length) {
                            case 1:
                                startSpeed = moveData[i].posy;
                                break;
                            case 2:
                                lastNum = moveData[i].posy;
                                break;
                        }
                        negative = startSpeed < lastNum;
                    } else if ((negative && lastNum < moveData[i].posy) || (!negative && lastNum > moveData[i].posy)) {
                        lastNum = moveData[i].posy;
                        moveRun.push(moveData[i]);
                    } else {
                        break;
                    }
                }
            }
            if (negative) {
                runTimer = window.requestAnimationFrame(runUp);
            } else {
                runTimer = window.requestAnimationFrame(runDown);
            }
        }
    }
    function move(ev) {
        ev.preventDefault()
        item.nY = ev.touches[0].pageY;
        item.nX = ev.touches[0].pageX;
        item.eY = item.tY - (item.sY - item.nY);
        item.eX = item.tX - (item.sX - item.nX);
        moveData.push({
            posy: item.sY - item.eY,
            posx: item.sX - item.eX,
            timer: new Date().getTime()
        });
        if (item.eY > 0) {
            item.eY = item.eY - item.eY / 2;
        } else if (item.eY < item.maxY) {
            item.eY = item.eY - (item.eY - item.maxY) / 2
        }
        if (item.eX > 0) {
            item.eX = item.eX - item.eX / 2;
        } else if (item.eX < item.maxX) {
            item.eX = item.eX - (item.eX - item.maxX) / 2
        }
        if (obj.X) {
            child.style.marginLeft = item.eX + 'px'
        }
        if (obj.Y) {
            child.style.marginTop = item.eY + 'px'
        }
    }
    function end() {
        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', end);
        item.timer = window.requestAnimationFrame(runBack);
    }
    el.addEventListener('touchstart', function (ev) {
        window.cancelAnimationFrame(item.timer);
        window.cancelAnimationFrame(runTimer);
        moveData = [];
        moveRun = [];
        item.sY = ev.touches[0].pageY;
        item.sX = ev.touches[0].pageX;
        item.tY = item.eY || 0;
        item.tX = item.eX || 0;
        item.eh = child.scrollHeight;
        if (!obj.addScroll || !item.ew ) {
            item.ew = child.scrollWidth;
        }
        item.isY = 0;
        if (!item.parentH) {
            item.ph = child.parentNode.clientHeight;
        }
        if (!item.parentH) {
            item.pw = child.parentNode.clientWidth;
        }
        item.maxY = item.eh > item.ph && item.ph - item.eh - obj.addScroll || 0;
        item.maxX = item.ew > item.pw && item.pw - item.ew - obj.addScroll || 0;
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', end);
    });
}