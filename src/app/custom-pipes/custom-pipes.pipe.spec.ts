import { DateModifyPipe } from './custom-pipes.pipe';

describe('CustomPipesPipe', () => {
  it('create an instance', () => {
    const pipe = new DateModifyPipe();
    expect(pipe).toBeTruthy();
  });
});
