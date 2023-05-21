class Stories extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        var openStories = null;

        // user specifies data-open-stories
        if (this.getAttribute('data-open-stories') != null) {
            images, openStories = this.parseOpenStories(this.getAttribute('data-open-stories'));
            this.images = images;
            this.openStories = openStories;
        }

        this.shadowRoot.innerHTML = `
            <main id="story">
                <div id="close">X</div>
                <section class="story" id="storyContainer">
                    <div class="image_counts"></div>
                    <img src="" id="featuredImage" />
                </section>
            </main>
        `;

        var img_count = images.length;

        var image_counts = this.shadowRoot.querySelector('.image_counts');

        // image counts width should be img_width + 3px margin

        image_counts.style.width = img_count * 100 + 'px';

        for (var i = 0; i < img_count; i++) {
            var span = document.createElement('span');
            span.classList.add('image_count');
            span.style.width = 100 / img_count - 4 + '%';
            span.id = 'image_count_' + i;
            image_counts.appendChild(span);
        }

        var featuredImage = this.shadowRoot.querySelector('#story img');

        featuredImage.src = images[0][0];

        if (openStories) {
            featuredImage.alt = openStories[images[0]]["alt"];
        } else {
            featuredImage.alt = images[0][1];
        }

        var image_count = this.shadowRoot.querySelector('#image_count_0');
        image_count.style.opacity = 1;

        // on tap
        featuredImage.addEventListener("click", () => {
            this.transition(featuredImage);
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

        var story = this.shadowRoot.querySelector('#story');

        story.style.display = 'none';

        this.shadowRoot.appendChild(document.querySelector('template').content.cloneNode(true));

        // click background but not image
        story.addEventListener("click", (e) => {
            if (e.target == this.shadowRoot.querySelector('#storyContainer') || e.target == this.shadowRoot.querySelector('#close')) {
                this.close();
            }
        });

        var auto_scroll_duration = 5;
        
        if (this.getAttribute("auto-scroll") && !openStories) {
            auto_scroll_duration = this.getAttribute("auto-scroll");
        } else if (openStories) {
            auto_scroll_duration = openStories[images[0]]["duration"];
        }

        setInterval(() => {
            this.transition(featuredImage);
        }, auto_scroll_duration * 1000);
    }

    transition (featuredImage, direction = "forward") {
        console.log("transitioning");
        var image_count = this.shadowRoot.querySelector('.image_count');

        image_count.style.opacity = 0.5;

        var flat_images = images.map((image) => {
            return image[0];
        });

        var current_image = flat_images.indexOf(featuredImage.src);

        if (direction == "forward") {
            var next_image = current_image + 1;
        } else {
            var next_image = current_image - 1;
        }

        if (next_image == images.length) {
            next_image = 0;
            this.close();
        }

        featuredImage.src = flat_images[next_image];

        for (var i = 0; i < images.length; i++) {
            var image_count = this.shadowRoot.querySelector('#image_count_' + i);
            image_count.style.opacity = 0.5;
        }
        
        var next_image_count = this.shadowRoot.querySelector('#image_count_' + next_image);

        next_image_count.style.opacity = 1;
        
        if (this.getAttribute("auto-scroll") && !this.openStories) {
            var auto_scroll_duration = this.getAttribute("auto-scroll");

            setInterval(() => {
                this.transition(featuredImage);
            }, auto_scroll_duration * 1000);
        } else if (this.openStories) {
            var auto_scroll_duration = this.openStories[images[0][0]]["duration"];

            setInterval(() => {
                this.transition(featuredImage);
            }, auto_scroll_duration * 1000);
        }
    }

    show () {
        var story = this.shadowRoot.querySelector('#story');
        story.style.display = 'block';
    }

    close () {
        var story = this.shadowRoot.querySelector('#story');
        story.style.display = 'none';
    }
    
    parseOpenStories (url) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((data) => {
                var openStoryImages = [];
                var openStories = {}

                for (var i = 0; i < data["items"].length; i++) {
                    var item = data["items"][i]["_open_stories"];

                    var now = new Date();

                    var expires = new Date(item["date_expired"]);

                    if (now > expires) {
                        continue;
                    }

                    if (item["type"] == "image") {
                        openStoryImages.push(item["url"]);
                    }

                    openStories[item["url"]] = item;
                }

                return [openStoryImages, openStories];
            });
        })
    }
}

customElements.define('html-story', Stories);

// write an nginx header to set cors for /openstories.json
//   add_header 'Access-Control-Allow-Origin' '*';