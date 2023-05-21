class Stories extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

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

        featuredImage.src = images[0];

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
        });

        var story = this.shadowRoot.querySelector('#story');

        story.style.display = 'none';

        this.shadowRoot.appendChild(document.querySelector('template').content.cloneNode(true));

        // click background but not image
        story.addEventListener("click", (e) => {
            if (e.target == this.shadowRoot.querySelector('#storyContainer')) {
                this.close();
            }
        });
        
        story.addEventListener("click", (e) => {
            if (e.target == this.shadowRoot.querySelector('#close')) {
                this.close();
            }
        });
    }

    transition (featuredImage, direction = "forward") {
        var image_count = this.shadowRoot.querySelector('.image_count');

        image_count.style.opacity = 0.5;

        var current_image = images.indexOf(featuredImage.src);

        if (direction == "forward") {
            var next_image = current_image + 1;
        } else {
            var next_image = current_image - 1;
        }

        if (next_image == images.length) {
            next_image = 0;
            this.close();
        }

        featuredImage.src = images[next_image];

        for (var i = 0; i < images.length; i++) {
            var image_count = this.shadowRoot.querySelector('#image_count_' + i);
            image_count.style.opacity = 0.5;
        }
        
        var next_image_count = this.shadowRoot.querySelector('#image_count_' + next_image);

        next_image_count.style.opacity = 1;
    }

    show () {
        var story = this.shadowRoot.querySelector('#story');
        story.style.display = 'block';
    }

    close () {
        var story = this.shadowRoot.querySelector('#story');
        story.style.display = 'none';
    }
}

customElements.define('html-story', Stories);