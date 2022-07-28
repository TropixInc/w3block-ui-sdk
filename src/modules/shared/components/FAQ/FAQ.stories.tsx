import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FAQ, FAQProps } from './FAQ'

export default {
  title: 'shared/FAQ',
  component: FAQ,
} as ComponentMeta<typeof FAQ>;

const singleProps: FAQProps = {
  title: 'FAQ',
  subtitle: 'Perguntas Frequentes',
  questions: [<div>Aliquam ullamcorper velit eget metus facilisis, eu porttitor dolor dignissim.</div>, <div>Proin tempus massa ac massa consectetur, eu efficitur velit lacinia.</div>],
  answers: [<div>Duis nisi quam, fringilla a consectetur ut, viverra quis nulla. Fusce lacinia augue lacus, at aliquet magna lacinia sit amet. Fusce a ipsum convallis, ultricies velit efficitur, feugiat neque. Donec sodales aliquam mauris sit amet imperdiet. Sed laoreet justo est, at auctor lacus convallis a. Proin ultrices, orci et suscipit sollicitudin, justo massa cursus nibh, non sodales lorem ipsum ut est.</div>, <div>Cras laoreet neque et ipsum convallis, vitae pulvinar turpis fringilla.</div>]
} 

const Template: ComponentStory<typeof FAQ> = (_) => <FAQ {...singleProps} />;

export const Example = Template.bind({});

Example.args = singleProps;


