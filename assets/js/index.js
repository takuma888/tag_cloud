(function(){


    document.addEventListener('DOMContentLoaded', ()=>{
        main();
    });


    function main (){

        let config = {
            width: 400,
            height: 400,
            radius: 200,
            maxSpeed: 0.075,
        };

        let yawSpeed = 0;
        let pitchSpeed = 0;
        let isSubside = true;

        let container = document.querySelector('#tag_cloud');
        let ul = container.querySelectorAll('ul')[0];
        let list = ul.querySelectorAll('li');
        let tagPool = [];

        function initContainer() {
            container.style.width = config.width + 'px';
            container.style.height = config.height + 'px';
        }

        function initTag(){
            list.forEach((node)=>{
                let tag = new Tag(node);
                tagPool.push(tag);
            });
            updateTags();
        }

        function updateTags(){
            tagPool.forEach((tag)=>{
                tag.update();
            });
        }

        function tick(){
            if (isSubside) {
                yawSpeed *= 0.98;
                pitchSpeed *= 0.98;
            }
            tagPool.forEach((tag)=>{
                tag.doPitch(-pitchSpeed);
                tag.doYaw(-yawSpeed);
            });
            updateTags();
        }

        function loop(){
            requestAnimationFrame(loop);
            tick();
        }

        /**
         * Tag
         * @param node
         * @constructor
         */
        function Tag(node){
            this.node = node;
            this.originPoint = {
                x: config.width * 0.5,
                y: config.height * 0.5
            };
            this.displayPoint = {
                x: config.width * 0.5,
                y: config.height * 0.5
            };
            this.tdPoint = {
                x: 0,
                y: 0,
                z: 0
            };
            this.radius = config.radius * 0.8;
            this.tdPoint.z = this.radius;
            this.width = node.clientWidth;
            this.height = node.clientHeight;

            let u= Math.random();
            let v= Math.random();
            let theta = 2 * Math.PI * u;
            let phi = Math.acos(2 * v - 1);
            this.tdPoint.x = Math.sin(theta) * Math.sin(phi) * this.radius;
            this.tdPoint.y = Math.cos(theta) * Math.sin(phi) * this.radius;
            this.tdPoint.z = Math.cos(phi) * this.radius;


        }

        Tag.prototype.doPitch = function(theta){
            let x = this.tdPoint.x;
            let y = this.tdPoint.y * Math.cos(theta) - this.tdPoint.z * Math.sin(theta);
            let z = this.tdPoint.y * Math.sin(theta) + this.tdPoint.z * Math.cos(theta);
            this.tdPoint.x = x;
            this.tdPoint.y = y;
            this.tdPoint.z = z;
        };

        Tag.prototype.doYaw = function(theta){
            let x = this.tdPoint.z * Math.sin(theta) + this.tdPoint.x * Math.cos(theta);
            let y = this.tdPoint.y;
            let z = this.tdPoint.z * Math.cos(theta) - this.tdPoint.x * Math.sin(theta);
            this.tdPoint.x = x;
            this.tdPoint.y = y;
            this.tdPoint.z = z;
        };

        Tag.prototype.update = function(){

            let x;
            let y;
            let zIndex;
            let opacity;

            this.width = this.node.clientWidth;
            this.height = this.node.clientHeight;

            x = this.tdPoint.x;
            y = -this.tdPoint.y;
            zIndex = Math.floor(this.tdPoint.z + this.radius);
            opacity = (zIndex / (this.radius * 2)) * 0.75 + 0.25;

            this.displayPoint.x = this.originPoint.x + x;
            this.displayPoint.y = this.originPoint.y + y;
            this.node.style.left = this.displayPoint.x - this.width * 0.5 + 'px';
            this.node.style.top = this.displayPoint.y - this.height * 0.5 + 'px';
            this.node.style.zIndex = zIndex;
            this.node.style.opacity = opacity;

        };

        container.addEventListener('mousemove', e=>{
            if (e.target !== container) return;
            yawSpeed = ((e.offsetX / config.width) - 0.5) * config.maxSpeed * 2;
            pitchSpeed = ((e.offsetY / config.height) - 0.5) * config.maxSpeed * 2;
            console.log(yawSpeed, pitchSpeed);
        });
        container.addEventListener('mouseover', e=>{
            if (e.target !== container) return;
            isSubside = false;
        });
        container.addEventListener('mouseout', e=>{
            if (e.target !== container) return;
            isSubside = true;
        });

        initContainer();
        initTag();
        loop();

    }


})();
