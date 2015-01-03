/**
 * Created by Mostafa on 01/03/2015.
 */

var imagesDir = "profile/images/";
function image(file) {
    return imagesDir + file;
};

var profile = {
    name: "Mostafa Gaafar",
    headshot: image("headshot.jpg"),
    summary: "5arteet el javascript, wotwat el css",
    headline: {
        sentence: 'I  <i class="fa fa-heart"></i> ',
        firstWord: "Javascript",
        words: ["CSS 3","HTML 5","AngularJS","Bootstrap"]
    },
    links: [
        //facebook
        {
            name: "facebook",
            url: "https://www.facebook.com/MostafaMGaafar",
            fa_icon: "facebook"
        },
        //twitter
        {
            name: "twitter",
            url: "https://twitter.com/iGa3far",
            fa_icon: "twitter"
        },
        //linkedin
        {
            name: "linkedin",
            url: "https://eg.linkedin.com/in/mostafamgaafar/",
            fa_icon: "linkedin"
        },
        //github
        {
            name: "github",
            url: "https://github.com/Gaafar",
            fa_icon: "github"
        }
    ],
    timeline: [
        {
            date: "Jan 2015",
            title: "Created awesome portfolio",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.",
            href: "https://github.com/Gaafar/portfolio",
            fa_icon: "university"
        }
    ]

};


/*mock data*/

timelineIcons = ['laptop', 'graduation-cap', 'gamepad', 'group', 'certificate', 'desktop', 'globe', 'trophy'];
for (var i = 0; i < 15; i++) {
    var clone = JSON.parse(JSON.stringify(profile.timeline[0]));
    clone.fa_icon = timelineIcons[Math.floor(Math.random() * timelineIcons.length)];
    profile.timeline.push(clone);
}
