class Stories extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        this.images = [];
        this.intervals = [];

        this.shadowRoot.innerHTML = `
            <main id="story">
                <div id="close">X</div>
                <section class="story" id="storyContainer">
                    <div class="image_counts"></div>
                    <img src="" id="featuredImage" />
                    <canvas id="image_canvas" style="display: none;"></canvas>
                </section>
            </main>
        `;

        var canvas = this.shadowRoot.querySelector('#image_canvas');

        // canvas.height = 600;
        // canvas.width = 337;

        this.boxes = [];

        // get context
        var ctx = canvas.getContext('2d');

        // when user clicks, make input pop up  
        // canvas.addEventListener('click', (e) => {
        //     var x = e.pageX - canvas.offsetLeft;
        //     var y = e.pageY - canvas.offsetTop;

        //     var input = document.createElement('input');

        //     input.type = 'text';
        //     input.width = 50;

        //     input.style.position = 'absolute';
        //     input.style.left = canvas.offsetLeft + x + 'px';
        //     input.style.top = canvas.offsetTop + y + 'px';

        //     // on submit
        //     input.addEventListener('keydown', (e) => {
        //         // enter key
        //         if (e.keyCode == 13) {
        //             // draw box
        //             // var x = input.offsetLeft;
        //             // var y = input.offsetTop;
        //             // text
        //             var text = input.value;
        //             // background
        //             ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        //             ctx.fillRect(x, y - 20, ctx.measureText(text).width, 20);
        //             ctx.font = '15px Verdana';
        //             ctx.fillStyle = 'white';
        //             ctx.fillText(text, x, y);
        //             input.remove();
        //             this.boxes.push([x, y, text]);
        //         }
        //     });

        //     canvas.parentNode.appendChild(input);

        //     input.focus();

        //     // if user presses Command + K, save image with canvas on top
        //     document.addEventListener('keydown', (e) => {
        //         if (e.keyCode == 75 && e.metaKey) {
        //             // draw featuredImage onto canvas
        //             // resize featured image
        //             var featuredImage = this.shadowRoot.querySelector('#featuredImage');

        //             var img_width = featuredImage.width;
        //             var img_height = featuredImage.height;

        //             var new_img = new Image();

        //             new_img.crossOrigin = "Anonymous";

        //             new_img.src = featuredImage.src;

        //             var new_img_width = canvas.width;
        //             var new_img_height = canvas.height;

        //             var ratio = img_width / img_height;

        //             if (img_width > img_height) {
        //                 new_img_height = canvas.width / ratio;
        //             } else {
        //                 new_img_width = canvas.height * ratio;
        //             }

        //             // clear canvas
        //             ctx.clearRect(0, 0, canvas.width, canvas.height);

        //             console.log(new_img_width, new_img_height);

        //             ctx.drawImage(new_img, 0, 0, new_img_width, new_img_height);
                    
        //             for (var i = 0; i < this.boxes.length; i++) {
        //                 var box = this.boxes[i];
        //                 ctx.font = '20px Verdana';
        //                 // paint grey behind each box
        //                 ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        //                 ctx.fillRect(box[0], box[1] - 20, ctx.measureText(box[2]).width, 20);
        //                 ctx.fillStyle = 'white';
        //                 ctx.fillText(box[2], box[0], box[1]);
        //             }

        //             var link = document.createElement('a');
        //             link.download = 'image.png';

        //             link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        //             link.click();
        //         }
        //     });
        // });

        var story = this.shadowRoot.querySelector('#story');

        story.style.display = 'none';

        this.shadowRoot.appendChild(document.querySelector('template').content.cloneNode(true));

        // click background but not image
        story.addEventListener("click", (e) => {
            if (e.target == this.shadowRoot.querySelector('#storyContainer') || e.target == this.shadowRoot.querySelector('#close')) {
                this.close();
            }
        });

        // press escape key to close
        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 27) {
                this.close();
            }
        });
    }

    transition (featuredImage, direction = "forward") {
        var image_count = this.shadowRoot.querySelector('.image_count');
        for (var i = 0; i < this.intervals.length; i++) {
            clearInterval(this.intervals[i]);
        }

        image_count.style.opacity = 0.5;

        var flat_images = this.images.map((image) => {
            return image[0];
        });

        var current_image = flat_images.indexOf(featuredImage.src);

        if (direction == "forward") {
            var next_image = current_image + 1;
        } else {
            var next_image = current_image - 1 < 0 ? 0 : current_image - 1;
        }

        if (next_image == this.images.length) {
            // next_image = 0;
            console.log("end");

            // stop all timers
            this.close();
            return;
        }

        featuredImage.src = flat_images[next_image];

        for (var i = 0; i < this.images.length; i++) {
            var image_count = this.shadowRoot.querySelector('#image_count_' + i);
            image_count.style.opacity = 0.5;
        }
        
        var next_image_count = this.shadowRoot.querySelector('#image_count_' + next_image);

        next_image_count.style.opacity = 1;
    }

    show () {
        var story = this.shadowRoot.querySelector('#story');
        story.style.display = 'block';

        console.log(this.images);

        var img_count = this.images.length;

        var image_counts = this.shadowRoot.querySelector('.image_counts');

        // image counts width should be img_width + 3px margin

        image_counts.style.width = "300px";

        // clear image_counts
        image_counts.innerHTML = '';

        for (var i = 0; i < img_count; i++) {
            var span = document.createElement('span');
            span.classList.add('image_count');
            span.style.width = 100 / img_count - 4 + '%';
            span.id = 'image_count_' + i;
            image_counts.appendChild(span);
        }

        var featuredImage = this.shadowRoot.querySelector('#story img');

        featuredImage.src = this.images[0][0];

        featuredImage.alt = this.images[0][1];

        var image_count = this.shadowRoot.querySelector('#image_count_0');
        image_count.style.opacity = 1;

        // on tap
        featuredImage.addEventListener("click", (event) => {
            // if first 50% of image
            if (event.offsetX < featuredImage.width / 2) {
                this.transition(featuredImage, "back");
            } else {
                this.transition(featuredImage);
            }
        });

        // on left / right
        featuredImage.addEventListener("keydown", (e) => {
            if (e.keyCode == 13 || e.keyCode == 37) {
                this.transition(featuredImage);
            }
            // on left, 
            if (e.keyCode == 39) {
                this.transition(featuredImage, "back");
            }
        });
        this.autoScrollListener();
    }

    close () {
        var story = this.shadowRoot.querySelector('#story');
        story.style.display = 'none';

        clearInterval(this.interval);
    }

    autoScrollListener () {
        var auto_scroll_duration = 5;
        
        if (this.getAttribute("auto-scroll")) {
            auto_scroll_duration = this.getAttribute("auto-scroll");
        }

        var interval = setInterval(() => {
            this.transition(this.featuredImage);
        }, auto_scroll_duration * 1000);

        this.intervals.push(interval);
    }
}

customElements.define('html-story', Stories);

// write an nginx header to set cors for /openstories.json
//   add_header 'Access-Control-Allow-Origin' '*';