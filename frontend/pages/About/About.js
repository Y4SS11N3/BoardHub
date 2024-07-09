import React, { useEffect, useRef, useState } from 'react';
import { motion, useViewportScroll, useTransform, useSpring } from 'framer-motion';
import { Users, Zap, BarChart, Globe, Shield, Coffee, Linkedin, Github, Twitter, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const ParallaxSection = ({ children, offset = 50 }) => {
  const [elementTop, setElementTop] = useState(0);
  const ref = useRef(null);
  const { scrollY } = useViewportScroll();

  const y = useSpring(
    useTransform(scrollY, [elementTop, elementTop + 1], [0, -offset]),
    { stiffness: 100, damping: 30, restDelta: 0.001 }
  );

  useEffect(() => {
    const element = ref.current;
    if (element) {
      setElementTop(element.offsetTop);
    }
  }, [ref]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

const TeamMember = ({ name, role, image, linkedin, github, twitter }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-800 p-6 rounded-xl shadow-lg"
  >
    <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
    <h3 className="text-xl font-semibold text-white text-center">{name}</h3>
    <p className="text-gray-400 text-center mb-4">{role}</p>
    <div className="flex justify-center space-x-4">
      <a href={linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-6 h-6 text-blue-400 hover:text-blue-300" /></a>
      <a href={github} target="_blank" rel="noopener noreferrer"><Github className="w-6 h-6 text-gray-400 hover:text-gray-300" /></a>
      <a href={twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-6 h-6 text-blue-400 hover:text-blue-300" /></a>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 p-6 rounded-xl shadow-lg"
  >
    <Icon className="w-12 h-12 text-indigo-500 mb-4 mx-auto" />
    <h3 className="text-xl font-semibold text-white text-center mb-2">{title}</h3>
    <p className="text-gray-400 text-center">{description}</p>
  </motion.div>
);

const ModernVideoPlayer = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);



  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <iframe
        ref={videoRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=0&modestbranding=1&rel=0`}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex justify-between items-center">

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="text-white"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full overflow-hidden">
      <ParallaxSection offset={100}>
        <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ scale }}
            className="absolute inset-0 z-0"
          >
            <img
              src="https://img.freepik.com/premium-photo/bird-paper-crane-origami-black-background-ai-generated_206846-2858.jpg"
              alt="Space"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              About BoardHub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-xl max-w-2xl mx-auto"
            >
              Empowering teams to collaborate, innovate, and achieve greatness together.
            </motion.p>
          </div>
        </header>
      </ParallaxSection>

      <main className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <section className="mb-32">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Story</h2>
            <ParallaxSection offset={50}>
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                <p className="text-lg md:text-xl text-center leading-relaxed mb-6">
                  The inspiration for BoardHub arose during my software engineering studies at ALX, where I observed our school's frequent use of Padlet for sharing monthly events and workshop information. This exposure piqued my interest, leading me to explore Padlet's functionality more deeply.
                </p>
                <p className="text-lg md:text-xl text-center leading-relaxed mb-6">
                  As I examined the platform, I recognized an exceptional opportunity for personal and professional growth. I realized that developing a similar application would challenge me to expand my technical skills across various domains of web development, from frontend technologies like React and Redux to backend systems using Node.js and Express, as well as database management with MySQL and Sequelize ORM.
                </p>
                <p className="text-lg md:text-xl text-center leading-relaxed mb-6">
                  BoardHub emerged not merely as a clone, but as a comprehensive learning journey, pushing me to integrate cutting-edge technologies and best practices in software engineering. This project represented a chance to bridge the gap between theoretical knowledge and practical application, enhancing my proficiency in areas such as user authentication, real-time collaboration features, and responsive UI/UX design.
                </p>
                <p className="text-lg md:text-xl text-center leading-relaxed">
                  Ultimately, BoardHub embodies my commitment to continuous learning and my passion for creating user-centric solutions, preparing me for the dynamic challenges of the tech industry.
                </p>
              </div>
            </ParallaxSection>
          </section>

          <section className="mb-32">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <FeatureCard 
                icon={Users}
                title="Real-time Collaboration"
                description="Work together seamlessly, no matter where your team is located."
              />
              <FeatureCard 
                icon={Zap}
                title="Intuitive Interface"
                description="A user-friendly design that enhances productivity and creativity."
              />
              <FeatureCard 
                icon={BarChart}
                title="Advanced Analytics"
                description="Gain insights from your boards with powerful data visualization tools."
              />
              <FeatureCard 
                icon={Globe}
                title="Global Accessibility"
                description="Access your boards from any device, anywhere in the world."
              />
              <FeatureCard 
                icon={Shield}
                title="Enterprise-grade Security"
                description="Keep your data safe with our robust security measures."
              />
              <FeatureCard 
                icon={Coffee}
                title="24/7 Support"
                description="Our dedicated team is always here to help you succeed."
              />
            </div>
          </section>

          <ParallaxSection offset={100}>
            <section className="mb-32 relative">
              <div className="absolute inset-0 bg-indigo-900 opacity-50 rounded-xl"></div>
              <div className="relative z-10 text-center py-20 px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <span className="text-4xl md:text-5xl font-bold block mb-2">100000+</span>
                    <p className="text-lg md:text-xl">Users Worldwide</p>
                  </div>
                  <div>
                    <span className="text-4xl md:text-5xl font-bold block mb-2">500000+</span>
                    <p className="text-lg md:text-xl">Boards Created</p>
                  </div>
                  <div>
                    <span className="text-4xl md:text-5xl font-bold block mb-2">98%</span>
                    <p className="text-lg md:text-xl">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            </section>
          </ParallaxSection>

          <section className="mb-32">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Meet the Creator</h2>
            <div className="flex justify-center">
              <TeamMember
                name="Yassine Mtejjal"
                role="Full-Stack Developer"
                image="https://media.licdn.com/dms/image/D4E03AQEQuRbyleYFeQ/profile-displayphoto-shrink_400_400/0/1695645031515?e=1725494400&v=beta&t=ymGpJoSYdInqmeugOSB9aU6ZdBhjK0cc0ml8diVhMuk"
                linkedin="https://www.linkedin.com/in/yassine-mtejjal"
                github="https://github.com/Y4SS11N3"
                twitter="https://twitter.com/"
              />
            </div>
            <div className="text-center mt-8">
              <p className="text-lg md:text-xl mb-4">
                BoardHub is a solo project, developed entirely by me as part of the ALX Software Engineering program.
              </p>
              <p className="text-lg md:text-xl mb-4">
                This project serves as my Portfolio Project for <a href="https://www.alxafrica.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">ALX</a>.
              </p>
              <p className="text-lg md:text-xl">
                Check out the <a href="https://github.com/Y4SS11N3/boardhub" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">GitHub repository</a> for BoardHub!
              </p>
            </div>
          </section>

          <ParallaxSection offset={50}>
            <section className="mb-32">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Watch Our Story</h2>
              <div className="max-w-4xl mx-auto">
                <ModernVideoPlayer videoId="t93w0EK67oc" />
              </div>
              <p className="text-center mt-8 text-lg md:text-xl">
              BoardHub: Our Team, Our Story, Our Vision              </p>
            </section>
          </ParallaxSection>

          <ParallaxSection offset={50}>
            <section className="text-center mb-32">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform Your Workflow?</h2>
              <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
                Join thousands of teams already using BoardHub to boost their productivity and creativity.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-indigo-700 transition duration-300"
              >
                Get Started Now
              </motion.button>
            </section>
          </ParallaxSection>
        </div>
      </main>
    </div>
  );
};

export default About;