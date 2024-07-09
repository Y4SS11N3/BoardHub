import React, { useState, useEffect } from 'react';
import { motion, useViewportScroll, useTransform, useSpring } from 'framer-motion';
import { Layout, Users, Zap, BarChart, Globe, Shield, ArrowRight, Check, Star } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gray-800 p-8 rounded-xl shadow-lg border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-xl"
  >
    <Icon className="w-12 h-12 text-indigo-400 mb-4" />
    <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, quote, image }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gray-800 p-8 rounded-xl shadow-lg relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
    <div className="flex items-center mb-6">
      <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4 object-cover" />
      <div>
        <div className="font-semibold text-xl text-white">{name}</div>
        <div className="text-indigo-300">{role}</div>
      </div>
    </div>
    <p className="text-gray-300 italic mb-4">"{quote}"</p>
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="fill-current" />
      ))}
    </div>
  </motion.div>
);

const ParallaxSection = ({ children, baseVelocity = 100 }) => {
  const { scrollY } = useViewportScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -baseVelocity]);
  const y2 = useTransform(scrollY, [0, 1000], [0, baseVelocity * 0.5]);
  const y3 = useTransform(scrollY, [0, 1000], [0, baseVelocity * 0.25]);

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        <img 
          src="https://img.freepik.com/premium-photo/origami-fish-black-background_175682-30505.jpg" 
          alt="Parallax Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute inset-0 bg-black bg-opacity-50"></motion.div>
      <motion.div style={{ y: y3 }} className="absolute inset-0 flex items-center justify-center">
        {children}
      </motion.div>
    </div>
  );
};

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  }, [target, duration]);

  return <span className="text-5xl font-bold">{count}+</span>;
};

const StatsSection = () => (
  <section className="bg-gray-900 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-16 text-white">BoardHub by the Numbers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div>
          <AnimatedCounter target={100000} />
          <p className="text-xl mt-2 text-indigo-300">Users Worldwide</p>
        </div>
        <div>
          <AnimatedCounter target={500000} />
          <p className="text-xl mt-2 text-indigo-300">Boards Created</p>
        </div>
        <div>
          <AnimatedCounter target={99999} />
          <p className="text-xl mt-2 text-indigo-300">Customer Satisfaction</p>
        </div>
      </div>
    </div>
  </section>
);

const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState('collaborate');

  const tabs = [
    { id: 'collaborate', title: 'Collaborate', icon: Users },
    { id: 'integrate', title: 'Integrate', icon: Zap },
    { id: 'analyze', title: 'Analyze', icon: BarChart },
  ];

  const tabContent = {
    collaborate: {
      title: 'Seamless Collaboration',
      description: 'Work together in real-time, share ideas, and make decisions faster than ever before.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    integrate: {
      title: 'Powerful Integrations',
      description: 'Connect BoardHub with your favorite tools to create a seamless workflow.',
      image: 'https://media.istockphoto.com/id/174847702/photo/blank-photo-with-index-card.jpg?s=612x612&w=0&k=20&c=W82Hw9DB7mvtaOs9uXRX2QqK-KrOeBWf060sJ5RjM4w=',
    },
    analyze: {
      title: 'Advanced Analytics',
      description: 'Gain deep insights from your boards with detailed analytics and data visualization.',
      image: 'https://img.freepik.com/premium-photo/origami-fish-black-background_175682-30505.jpg',
    },
  };

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">Discover BoardHub's Power</h2>
        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-full mr-4 ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <tab.icon className="mr-2" />
              {tab.title}
            </button>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-12">
              <h3 className="text-3xl font-bold mb-4 text-white">{tabContent[activeTab].title}</h3>
              <p className="text-gray-300 mb-6">{tabContent[activeTab].description}</p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300">
                Learn More
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={tabContent[activeTab].image}
                alt={tabContent[activeTab].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



const Home = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <ParallaxSection>
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-7xl font-bold mb-6"
          >
            Welcome to BoardHub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl mb-10 max-w-3xl mx-auto"
          >
            Unleash Creativity, Boost Collaboration, Achieve More
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:bg-indigo-700 transition duration-300 inline-flex items-center"
          >
            Get Started Now <ArrowRight className="ml-2" />
          </motion.button>
        </div>
      </ParallaxSection>

      <main>
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-16 text-center text-white">Why Choose BoardHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <FeatureCard 
                icon={Layout}
                title="Intuitive Design"
                description="Create stunning boards with our user-friendly interface that sparks creativity and enhances productivity."
              />
              <FeatureCard 
                icon={Users}
                title="Seamless Collaboration"
                description="Work together in real-time, anywhere in the world. Break down silos and foster teamwork like never before."
              />
              <FeatureCard 
                icon={Zap}
                title="Powerful Integrations"
                description="Connect with your favorite tools to supercharge productivity and streamline your workflow."
              />
              <FeatureCard 
                icon={BarChart}
                title="Advanced Analytics"
                description="Gain deep insights from your boards with detailed analytics. Make data-driven decisions with ease."
              />
              <FeatureCard 
                icon={Globe}
                title="Global Accessibility"
                description="Access your boards from any device, anywhere, anytime. Your workspace is always at your fingertips."
              />
              <FeatureCard 
                icon={Shield}
                title="Enterprise-grade Security"
                description="Keep your data safe with our robust security measures. Your peace of mind is our top priority."
              />
            </div>
          </div>
        </section>

        <StatsSection />

        <FeatureShowcase />

        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-16 text-center text-white">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <TestimonialCard 
                name="Aya Mte"
                role="Software Engineer"
                quote="BoardHub's intuitive design and powerful features have greatly enhanced our team's productivity and innovation capabilities."
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              />
              <TestimonialCard 
                name="Anas M."
                role="Marketing Director"
                quote="The collaboration tools in BoardHub have transformed how we brainstorm and execute ideas across our global teams."
                image="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              />
              <TestimonialCard 
                name="Yassir R."
                role="Data Analyst"
                quote="BoardHub's enterprise-grade security and seamless integration with our existing tools make it an invaluable asset for our company."
                image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </div>
          </div>
        </section>

        <section className="text-center py-20 bg-indigo-900">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-8">Ready to Transform Your Workflow?</h2>
            <p className="text-2xl mb-10 max-w-3xl mx-auto">
              Join thousands of teams already using BoardHub to boost their productivity and creativity.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Start Your Free Trial
            </motion.button>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Home;