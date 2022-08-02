import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FAQ, FAQProps } from './FAQ'
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'shared/FAQ',
  component: FAQ,
} as ComponentMeta<typeof FAQ>;

const singleProps: FAQProps = {
  title: 'FAQ',
  subtitle: 'Perguntas Frequentes',
  identifier: ''
} 

const queryClient = new QueryClient();

const Template: ComponentStory<typeof FAQ> = (_) => (<QueryClientProvider client={queryClient}><FAQ {...singleProps} /></QueryClientProvider>);

export const Example = Template.bind({});

Example.args = singleProps;


