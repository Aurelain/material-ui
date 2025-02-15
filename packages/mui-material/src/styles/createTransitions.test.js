import { expect } from 'chai';
import { createTheme } from '@mui/material/styles';
import createTransitions, { easing, duration } from './createTransitions';

describe('createTransitions', () => {
  const transitons = createTransitions({});
  const create = transitons.create;
  const getAutoHeightDuration = transitons.getAutoHeightDuration;

  it('should allow to customize the default duration', () => {
    const theme = createTheme({
      transitions: {
        duration: {
          standard: 432,
        },
      },
    });
    expect(theme.transitions.create('color')).to.equal(`color 432ms ${easing.easeInOut} 0ms`);
  });

  describe('create() function', () => {
    describe('warnings', () => {
      it('should warn when first argument is of bad type', () => {
        expect(() => create(5554)).toErrorDev(
          'Material-UI: Argument "props" must be a string or Array',
        );
        expect(() => create({})).toErrorDev(
          'Material-UI: Argument "props" must be a string or Array',
        );
      });

      it('should warn when bad "duration" option type', () => {
        expect(() => create('font', { duration: null })).toErrorDev(
          'Material-UI: Argument "duration" must be a number or a string but found null',
        );
        expect(() => create('font', { duration: {} })).toErrorDev(
          'Material-UI: Argument "duration" must be a number or a string but found [object Object]',
        );
      });

      it('should warn when bad "easing" option type', () => {
        expect(() => create('transform', { easing: 123 })).toErrorDev(
          'Material-UI: Argument "easing" must be a string',
        );
        expect(() => create('transform', { easing: {} })).toErrorDev(
          'Material-UI: Argument "easing" must be a string',
        );
      });

      it('should warn when bad "delay" option type', () => {
        expect(() => create('size', { delay: null })).toErrorDev(
          'Material-UI: Argument "delay" must be a number or a string',
        );
        expect(() => create('size', { delay: {} })).toErrorDev(
          'Material-UI: Argument "delay" must be a number or a string',
        );
      });

      it('should warn when passed unrecognized option', () => {
        expect(() => create('size', { fffds: 'value' })).toErrorDev(
          'Material-UI: Unrecognized argument(s) [fffds]',
        );
      });
    });

    it('should create default transition without arguments', () => {
      const transition = create();
      expect(transition).to.equal(`all ${duration.standard}ms ${easing.easeInOut} 0ms`);
    });

    it('should take string props as a first argument', () => {
      const transition = create('color');
      expect(transition).to.equal(`color ${duration.standard}ms ${easing.easeInOut} 0ms`);
    });

    it('should also take array of props as first argument', () => {
      const options = { delay: 20 };
      const multiple = create(['color', 'size'], options);
      const single1 = create('color', options);
      const single2 = create('size', options);
      const expected = `${single1},${single2}`;
      expect(multiple).to.equal(expected);
    });

    it('should optionally accept number "duration" option in second argument', () => {
      const transition = create('font', { duration: 500 });
      expect(transition).to.equal(`font 500ms ${easing.easeInOut} 0ms`);
    });

    it('should optionally accept string "duration" option in second argument', () => {
      const transition = create('font', { duration: '500ms' });
      expect(transition).to.equal(`font 500ms ${easing.easeInOut} 0ms`);
    });

    it('should round decimal digits of "duration" prop to whole numbers', () => {
      const transition = create('font', { duration: 12.125 });
      expect(transition).to.equal(`font 12ms ${easing.easeInOut} 0ms`);
    });

    it('should optionally accept string "easing" option in second argument', () => {
      const transition = create('transform', { easing: easing.sharp });
      expect(transition).to.equal(`transform ${duration.standard}ms ${easing.sharp} 0ms`);
    });

    it('should optionally accept number "delay" option in second argument', () => {
      const transition = create('size', { delay: 150 });
      expect(transition).to.equal(`size ${duration.standard}ms ${easing.easeInOut} 150ms`);
    });

    it('should optionally accept string "delay" option in second argument', () => {
      const transition = create('size', { delay: '150ms' });
      expect(transition).to.equal(`size ${duration.standard}ms ${easing.easeInOut} 150ms`);
    });

    it('should round decimal digits of "delay" prop to whole numbers', () => {
      const transition = create('size', { delay: 1.547 });
      expect(transition).to.equal(`size ${duration.standard}ms ${easing.easeInOut} 2ms`);
    });

    it('should return zero when not passed arguments', () => {
      const zeroHeightDuration = getAutoHeightDuration();
      expect(zeroHeightDuration).to.equal(0);
    });

    it('should return zero when passed undefined', () => {
      const zeroHeightDuration = getAutoHeightDuration(undefined);
      expect(zeroHeightDuration).to.equal(0);
    });

    it('should return zero when passed null', () => {
      const zeroHeightDuration = getAutoHeightDuration(null);
      expect(zeroHeightDuration).to.equal(0);
    });

    it('should return NaN when passed a negative number', () => {
      const zeroHeightDurationNegativeOne = getAutoHeightDuration(-1);
      // eslint-disable-next-line no-restricted-globals
      expect(isNaN(zeroHeightDurationNegativeOne)).to.equal(true);
      const zeroHeightDurationSmallNegative = getAutoHeightDuration(-0.000001);
      // eslint-disable-next-line no-restricted-globals
      expect(isNaN(zeroHeightDurationSmallNegative)).to.equal(true);
      const zeroHeightDurationBigNegative = getAutoHeightDuration(-100000);
      // eslint-disable-next-line no-restricted-globals
      expect(isNaN(zeroHeightDurationBigNegative)).to.equal(true);
    });

    it('should return values for pre-calculated positive examples', () => {
      let zeroHeightDuration = getAutoHeightDuration(14);
      expect(zeroHeightDuration).to.equal(159);
      zeroHeightDuration = getAutoHeightDuration(100);
      expect(zeroHeightDuration).to.equal(239);
      zeroHeightDuration = getAutoHeightDuration(0.0001);
      expect(zeroHeightDuration).to.equal(46);
      zeroHeightDuration = getAutoHeightDuration(100000);
      expect(zeroHeightDuration).to.equal(6685);
    });
  });
});
