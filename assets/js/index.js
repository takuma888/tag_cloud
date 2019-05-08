(function(){


    document.addEventListener('DOMContentLoaded', ()=>{
        main();
    });


    function main (){

        let config = {
            width: 400,
            height: 400,
            radius: 200,
            maxSpeed: 0.05,
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
                tag.yaw += yawSpeed;
                tag.pitch += pitchSpeed;
            });
            updateTags();
        }

        function loop(){
            tick();
            requestAnimationFrame(loop);
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
            this.radius = config.radius * 0.8;
            this.pitch = Math.random() * Math.PI * 2;
            this.roll = 0;
            this.yaw = Math.random() * Math.PI * 2;
            this.width = node.clientWidth;
            this.height = node.clientHeight;
        }

        Tag.prototype.update = function(){

            let x;
            let y;
            let z;
            let a;
            let indexZ;
            let opacity;
            let pitch = this.pitch;
            let yaw = this.yaw;

            this.width = this.node.clientWidth;
            this.height = this.node.clientHeight;

            y = Math.sin(pitch) * this.radius * -1;
            a = y / Math.tan(pitch);
            x = Math.sin(yaw) * a;
            z = x / Math.tan(yaw);
            indexZ = Math.floor(this.radius - z);
            opacity = (1 - (indexZ / (this.radius * 2))) * 0.8 + 0.2;

            this.displayPoint.x = this.originPoint.x + x;
            this.displayPoint.y = this.originPoint.y + y;
            this.node.style.left = this.displayPoint.x - this.width * 0.5 + 'px';
            this.node.style.top = this.displayPoint.y - this.height * 0.5 + 'px';
            this.node.style.zIndex = this.radius * 2 - indexZ;
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
