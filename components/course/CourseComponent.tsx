"use client";

import CourseCard from '../courseCard/CourseCard';
import CourseHeader from './header/Header';

const CourseComponent = () => {
  return(
    <div>
        <CourseHeader/>
        <CourseCard />
    </div>
  );
};

export default CourseComponent;